package org.code.exceptions;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResouceNotFoundException  extends RuntimeException {
    String resouceName;
    String fieldName;
    long fieldValue;
    public ResouceNotFoundException(String resouceName, String fieldName, long fieldValue) {
        super(String.format("User with id: %s not found", resouceName,fieldName,fieldValue));
        this.resouceName = resouceName;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }
}
